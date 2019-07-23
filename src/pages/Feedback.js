import React, { useState, Fragment, useEffect } from "react"
import { Link, navigate } from "gatsby"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { button, form_row, checkbox, close_icon } from "../components/jss/cvcss"
import Variables from "../components/jss/Variables"

import star_on from "../images/star-on.svg"
import star_off from "../images/star-off.svg"

const Feedback = ({ location }) => {
  const [rating, setRating] = useState(null)
  const [email, setEmail] = useState("")
  const [remark, setRemark] = useState("")
  const [lsFeedBack, setLsFeedBack] = useState("")

  const { star, track } = location.state

  useEffect(() => {
    setEmail(JSON.parse(localStorage.getItem("user")).email)
    setLsFeedBack(JSON.parse(localStorage.getItem("feedback")))
    if (location) setRating(star)
  }, [])

  const ratingProvider = () => {
    const values = [1, 2, 3, 4, 5]
    return (
      <Fragment>
        {values.map((ratingNum, index) => {
          if (ratingNum <= rating) {
            return (
              <img
                src={star_on}
                onClick={() => setRating(ratingNum)}
                key={index}
              />
            )
          } else {
            return (
              <img
                src={star_off}
                onClick={() => setRating(ratingNum)}
                key={index}
              />
            )
          }
        })}
      </Fragment>
    )
  }

  const onsubmit = () => {
    let remarks = "no Remarks"
    if (remark !== "") remarks = remark

    const feedback = lsFeedBack
    lsFeedBack[track.trackId] = { rating, remarks, title: track.title }

    //update the dynamoDB and call below local storage functions in callback

    localStorage.setItem("user", JSON.stringify({ email }))
    localStorage.setItem("feedback", JSON.stringify(feedback))
    return null
  }

  const renderButton = () => {
    if (!email || !rating) {
      return (
        <button css={button} disabled>
          Submit
        </button>
      )
    } else {
      return (
        <button css={button} onClick={onsubmit}>
          Submit
        </button>
      )
    }
  }

  return (
    <Container>
      <form
        css={Form}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <Header>
          <Title>FeedBack</Title>
          <span onClick={() => navigate("/AgendaPage")} css={[close_icon, CloseIcon]}>
            close
          </span>
        </Header>
        <div css={feedBack}>
          <div css={eventTitle}><small>{track.title}</small></div>
          <div css={form_row}>
            <div>{ratingProvider()}</div>
          </div>
          <div css={form_row}>
            <input
              placeholder="Enter Email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div css={form_row}>
            <textarea
              placeholder="Remarks"
              value={remark}
              onChange={e => setRemark(e.target.value)}
            />
          </div>
          <div css={form_row}>
            <div css={checkbox}>
              <label>
                <input defaultChecked type="checkbox" />
                <span>
                  <small className="check"></small>Do you want AWS sales /
                  experts to contact you?
                </span>
              </label>
            </div>
          </div>
          <div css={form_row}>
            <label className="key">
              <small>
                By clicking submit, you agree to our{" "}
                <Link to="/">Terms & conditions</Link>{" "}
              </small>
            </label>
            <div>{renderButton()}</div>
          </div>
        </div>
      </form>
    </Container>
  )
}

export default Feedback

//Styling

const Container = styled.div`
  padding-top: 80px;
  height: calc(100vh - 50px) !important;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999;
  background: ${Variables.black_bg};
`

const Title = styled.span`
  color: ${Variables.dark_base_color};
  text-decoration: none;
  display: block;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  padding: 0 ${Variables.gutter_width};
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CloseIcon = css`
  right: 10px;
  top: 0;
  position: absolute;
  margin: auto;
  bottom: 0;
  &:before,
  &:after {
    background: ${Variables.dark_base_color};
  }
`

const Form = css`
  color: #fff;
  margin: 15px;
  height: 100%;
`

const eventTitle = css`
  margin-bottom: 20px;
  padding: 0 20px;
`

const feedBack = css`
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  a {
    color: ${Variables.dark_base_color};
  }
  > div:last-child {
    margin-top: auto;
    margin-bottom: 0;
  }
  img {
    display: inline-block;
    height: 35px;
    ~ img {
      margin-left: 7px;
    }
  }
`
